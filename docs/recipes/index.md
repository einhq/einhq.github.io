# Recipes

The Recipes module keeps the household's recipes: their ingredients and steps, how many they serve,
how long they take, and pictures of the dish. A recipe's page scales the ingredients to the number
of servings you want.

## Install it

Install it from **Settings → Modules**, or in EiN's terminal:

```bash
# in EiN's terminal, as the administrator
mod install recipes
```

**Recipes** is then in the sidebar, and **Recipe** in the top bar's **Create** menu.
[Modules](../admin/modules.md) covers installing and removing modules.

## Where recipes are

Every recipe is in `/archive/recipes`, one node of type `recipe` each, named after its title:
Wrenfield apple cake is `/archive/recipes/wrenfield-apple-cake`. Everyone signed in can read the
recipes, and everyone with an account can add and change them.

A recipe's pictures are files in its `pictures/` folder, and one of them is its cover. They are not
part of the library: `/archive/recipes` is marked unlisted, so the library's own views (the Media
page, the map, On this day, search's pictures) leave them out, and it
[wants only renditions](../archive/processing.md#which-processing-a-folder-gets), so with the Archive
module installed the pictures get their thumbnails and nothing else: no faces, text or picture
search. The recipes themselves are found by search, by their title and description.

## Write a recipe

Choose **Create → Recipe** in the top bar, or **New recipe** on the Recipes page. Only **Title** is
needed; fill in what you know:

- **Serves**: how many servings the amounts are written for. A recipe's page can scale them only
  when this is said.
- **Time in minutes**, **Difficulty** and **Rating**.
- **Categories**: separated by commas, such as `Baking, Dessert`. The Recipes page narrows to one.
- **Ingredients** and **Steps**: one per line. A line starting with `#` names a section, and the
  lines after it belong to it until the next such line:

  ```
  4 apples
  # Batter
  2 dl sugar
  100 g butter
  ```

- **Language**: the language the recipe is written in, such as `sv` for Swedish. EiN's own words
  stay in yours; a recipe's amounts are written the way its language writes numbers.
- **Taken from**: the address of the page the recipe came from. Its page links back to it.

Choose **Create**. **Edit** on a recipe's page opens the same form; a field you empty is taken away.

## Cook from a recipe

Open **Recipes** in the sidebar and pick a recipe. Type in **Filter recipes…** to narrow them by
title, and use **Category** and **Sort** beside it.

- The **−** and **+** beside **Ingredients** change the number of servings, and every amount EiN
  could read changes with them: `2 dl sugar` for four becomes `3 dl sugar` for six. A line without an
  amount, such as `salt and pepper`, stays as written.
- Tap an ingredient or a step to strike it through, to keep your place while cooking. Neither the
  servings nor what is struck through is saved.
- **Upload** in the page's header adds pictures, or drop them on the page. The first becomes the
  recipe's cover; under the recipe, the star on another makes it the cover instead.
- **Move to trash** under ⋮ takes the recipe, with its pictures, into your trash.

## From the terminal

The [Recipes commands](commands.md) do the same from EiN's terminal: `recipe-create`, `recipe-set`,
`recipe-show`, `recipe-list`, `recipe-categories` and `recipe-cover`.

```bash
recipe-create 'Wrenfield apple cake' --serves 8 --categories 'Baking, Dessert' \
  --ingredients $'4 apples\n2 dl sugar\n100 g butter' --steps $'Slice the apples.\nBake for 40 minutes.'
recipe-list --category Baking
recipe-show wrenfield-apple-cake
```
