# Markdown Extension Examples

This page demonstrates some of the built-in markdown extensions provided by VitePress.

## Syntax Highlighting

VitePress provides Syntax Highlighting powered by [Shiki](https://github.com/shikijs/shiki), with additional features like line-highlighting:

**Input**

````md
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

**Output**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## Custom Containers

**Input**

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**Output**

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## Mermaid Diagrams

**Input**

````md
```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Condition 1| C[Process 1]
    B -->|Condition 2| D[Process 2]
    C --> E[End]
    D --> E
```
````

**Output**

```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Condition 1| C[Process 1]
    B -->|Condition 2| D[Process 2]
    C --> E[End]
    D --> E
```

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
