# Markdown 扩展示例

此页面演示了 VitePress 提供的一些内置 markdown 扩展。

## 语法高亮

VitePress 提供由 [Shiki](https://github.com/shikijs/shiki) 提供支持的语法高亮，并具有额外的功能，如行高亮：

**输入**

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

**输出**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## 自定义容器

**输入**

```md
::: info
这是一个信息框。
:::

::: tip
这是一个提示。
:::

::: warning
这是一个警告。
:::

::: danger
这是一个危险警告。
:::

::: details
这是一个详情块。
:::
```

**输出**

::: info
这是一个信息框。
:::

::: tip
这是一个提示。
:::

::: warning
这是一个警告。
:::

::: danger
这是一个危险警告。
:::

::: details
这是一个详情块。
:::

## Mermaid 图表

**输入**

````md
```mermaid
graph TD
    A
    B
    A-->B
```
````

**输出**

```mermaid
graph TD
    A
    B
    A-->B
```

## 更多

查看文档了解 [完整的 markdown 扩展列表](https://vitepress.dev/guide/markdown)。