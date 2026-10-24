# The EiN presentation site: a static page, published as it is by GitHub Pages.
#
#   make capture URL=http://demo.example:8080   screenshots and node pictures from a demo instance, into build/
#   make images                                  build/ into the WebP files the page loads, under assets/
#   make serve                                   the site on http://localhost:4507
#   make fmt                                     format with deno fmt, as the pre-commit hook checks

SHELL := /bin/bash
# A glob that matches nothing expands to nothing, and a failing command stops the recipe.
.SHELLFLAGS := -e -O nullglob -c
URL ?= http://localhost:8080
# Quality of the screenshots' WebP files; the node pictures in the hero are small and take less.
QUALITY ?= 80

.PHONY: help capture images thumbs serve fmt check

help: ## Show targets
	@grep -E '^[a-z-]+:.*##' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-10s %s\n", $$1, $$2}'

capture: ## Screenshots and node pictures from the demo at URL (ONLY=a,b for some shots, NODES=1 for the node pictures alone)
	deno task capture --url $(URL) $(if $(ONLY),--only $(ONLY),) $(if $(NODES),--nodes,)

# Each shot at its CSS width (the PNG's width over its scale: 3 for a phone, 2 otherwise) and twice
# that, so a clipped shot keeps its own size.
images: ## WebP files under assets/ from build/: each shot at 1x and 2x, each node picture at 256 px
	@mkdir -p assets/shots assets/nodes
	@for png in build/shots/*.png; do \
	  id=$$(basename "$$png" .png); \
	  case $$id in phone-*) scale=3 ;; *) scale=2 ;; esac; \
	  w=$$(( $$(identify -format '%w' "$$png") / scale )); \
	  convert "$$png" -resize "$${w}x" -strip -quality $(QUALITY) "assets/shots/$$id.webp"; \
	  convert "$$png" -resize "$$((w * 2))x" -strip -quality $(QUALITY) "assets/shots/$$id@2x.webp"; \
	  echo "assets/shots/$$id.webp $$(identify -format '%wx%h' "assets/shots/$$id.webp")"; \
	done
	@if [ -f build/nodes/manifest.json ]; then \
	  rm -f assets/nodes/*.webp; \
	  for avif in build/nodes/*.avif; do \
	    convert "$$avif" -resize '256x256^' -gravity center -extent 256x256 -strip -quality 72 "assets/nodes/$$(basename "$$avif" .avif).webp"; \
	  done; \
	  cp build/nodes/manifest.json assets/nodes/manifest.json; \
	fi
	@$(MAKE) --no-print-directory thumbs
	@du -sh assets/shots assets/nodes

# The gallery's cards load these: each desktop shot's 2x file at 640 px wide.
thumbs: ## The gallery's thumbnails under assets/shots/thumbs/, from the shots' 2x WebP files
	@mkdir -p assets/shots/thumbs
	@for src in assets/shots/*@2x.webp; do \
	  id=$$(basename "$$src" @2x.webp); \
	  case $$id in phone-*) continue ;; esac; \
	  convert "$$src" -resize 640x -strip -quality 76 "assets/shots/thumbs/$$id.webp"; \
	done
	@du -sh assets/shots/thumbs

serve: ## Serve the site on http://localhost:4507
	deno task serve

fmt: ## Format every file deno fmt knows
	deno fmt index.html assets/*.css assets/*.js tools/*.ts README.md deno.jsonc

check: ## Check formatting and the capture tool's types
	deno fmt --check index.html assets/*.css assets/*.js tools/*.ts README.md deno.jsonc
	deno check tools/capture.ts
