<!-- Written by tools/reference.ts from `docs commands` on a running EiN: make reference, never by hand. -->

# Recipes commands

The commands the recipes module adds. They are there once the module is installed. 7 of them, by name. Every command also says this with `--help`; [Commands](../reference/commands.md) explains how to read an entry.

[recipe-categories](#recipe-categories) · [recipe-cover](#recipe-cover) · [recipe-create](#recipe-create) · [recipe-list](#recipe-list) · [recipe-set](#recipe-set) · [recipe-show](#recipe-show) · [search-recipe](#search-recipe)

## R

### `recipe-categories`

List the categories recipes are in, with how many are in each.

<small>reads only</small>

```text
recipe-categories
```

```bash
recipe-categories
```

With `JSON_OUTPUT=1`: One entry per category: name and count, the fullest first.

### `recipe-cover`

Make one of a recipe's pictures the one it is shown with; with none named, its first, when it has no cover yet.

<small>changes things</small>

```text
recipe-cover <recipe> <picture>
```

| Argument    | What it is                                               |
| ----------- | -------------------------------------------------------- |
| `<recipe>`  | the recipe, by its path or its name in /archive/recipes. |
| `<picture>` | one of its pictures, by its path or its name.            |

```bash
recipe-cover apple-cake
recipe-cover apple-cake baked.jpg
```

With `JSON_OUTPUT=1`: The recipe.

### `recipe-create`

Add a recipe: its title, and its ingredients, steps and the rest if you like.

<small>changes things</small>

```text
recipe-create [--description=<string>] [--serves=<number>] [--minutes=<number>] [--difficulty=<number>] [--rating=<number>] [--categories=<string>] [--lang=<string>] [--source=<string>] [--allergies=<string>] [--ingredients=<string>] [--steps=<string>] <title>
```

| Argument  | What it is               |
| --------- | ------------------------ |
| `<title>` | what the dish is called. |

| Option                   | What it does                                                           |
| ------------------------ | ---------------------------------------------------------------------- |
| `--description=<string>` | a line or two about it.                                                |
| `--serves=<number>`      | how many servings the amounts are for.                                 |
| `--minutes=<number>`     | how long it takes in all, in minutes.                                  |
| `--difficulty=<number>`  | 1 easy, 2 medium, 3 demanding.                                         |
| `--rating=<number>`      | how good it is, 1 to 5.                                                |
| `--categories=<string>`  | the categories it is in, separated by commas (Dinner, Fish)            |
| `--lang=<string>`        | the language it is written in, such as sv or en.                       |
| `--source=<string>`      | the address of the page it was taken from.                             |
| `--allergies=<string>`   | what it holds that someone may not eat.                                |
| `--ingredients=<string>` | the ingredients, one per line; a line starting with # names a section. |
| `--steps=<string>`       | the steps, one per line; a line starting with # names a section.       |

```bash
recipe-create 'Apple cake' --serves 8 --categories 'Baking, Dessert' --ingredients $'4 apples\n2 dl sugar\n100 g butter' --steps $'Slice the apples.\nBake for 40 minutes.'
```

With `JSON_OUTPUT=1`: The new recipe: path, title, its facts, ingredients, steps and pictures.

### `recipe-list`

List the recipes, by title or the newest first, in a category or with words in their title.

<small>reads only</small>

```text
recipe-list [--category=<string>] [--sort=<string>] [--limit=<number>] [--after=<string>] <text>
```

| Argument | What it is             |
| -------- | ---------------------- |
| `<text>` | words the title holds. |

| Option                | What it does                                     |
| --------------------- | ------------------------------------------------ |
| `--category=<string>` | only the recipes in this category.               |
| `--sort=<string>`     | title (the default) or newest.                   |
| `--limit=<number>`    | how many to list, 48 unless said.                |
| `--after=<string>`    | the next page, as the previous page answered it. |

```bash
recipe-list
recipe-list --category Baking
recipe-list cake --sort newest
```

With `JSON_OUTPUT=1`: recipes (path, title, description, serves, totalMinutes, difficulty, rating, categories, lang, site), and next when there are more.

### `recipe-set`

Change what a recipe says; a field given empty is taken away.

<small>changes things</small>

```text
recipe-set [--title=<string>] [--description=<string>] [--serves=<number>] [--minutes=<number>] [--difficulty=<number>] [--rating=<number>] [--categories=<string>] [--lang=<string>] [--source=<string>] [--allergies=<string>] [--ingredients=<string>] [--steps=<string>] <recipe>
```

| Argument   | What it is                                               |
| ---------- | -------------------------------------------------------- |
| `<recipe>` | the recipe, by its path or its name in /archive/recipes. |

| Option                   | What it does                                                           |
| ------------------------ | ---------------------------------------------------------------------- |
| `--title=<string>`       | its new title.                                                         |
| `--description=<string>` | a line or two about it.                                                |
| `--serves=<number>`      | how many servings the amounts are for.                                 |
| `--minutes=<number>`     | how long it takes in all, in minutes.                                  |
| `--difficulty=<number>`  | 1 easy, 2 medium, 3 demanding.                                         |
| `--rating=<number>`      | how good it is, 1 to 5.                                                |
| `--categories=<string>`  | the categories it is in, separated by commas (Dinner, Fish)            |
| `--lang=<string>`        | the language it is written in, such as sv or en.                       |
| `--source=<string>`      | the address of the page it was taken from.                             |
| `--allergies=<string>`   | what it holds that someone may not eat.                                |
| `--ingredients=<string>` | the ingredients, one per line; a line starting with # names a section. |
| `--steps=<string>`       | the steps, one per line; a line starting with # names a section.       |

```bash
recipe-set apple-cake --serves 6 --rating 5
recipe-set apple-cake --description ''
```

With `JSON_OUTPUT=1`: The recipe as it is now.

### `recipe-show`

Show a recipe: its facts, ingredients and steps.

<small>reads only</small>

```text
recipe-show <recipe>
```

| Argument   | What it is                                               |
| ---------- | -------------------------------------------------------- |
| `<recipe>` | the recipe, by its path or its name in /archive/recipes. |

```bash
recipe-show apple-cake
```

With `JSON_OUTPUT=1`: The recipe: path, title, description, serves, totalMinutes, difficulty, rating, categories, lang, site, source, allergyInfo, ingredients, steps and pictures.

## S

### `search-recipe`

Search recipes by title or description.

<small>reads only</small>

```text
search-recipe [--kinds] [-l <number>] <query>
```

| Argument  | What it is         |
| --------- | ------------------ |
| `<query>` | Search query text. |

| Option        | What it does                                                |
| ------------- | ----------------------------------------------------------- |
| `--kinds`     | print the content kinds this provider can return, and exit. |
| `-l <number>` | Max results per channel (default 10)                        |

```bash
search-recipe 'apple cake'
```

With `JSON_OUTPUT=1`: matching recipes, one row per channel that found it (name, description), best first within each.
