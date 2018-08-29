---
title: Stateless components in React & TypeScript
deck: ""
date: 2016-09-29 12:53
---

When you're working with React, one of the benefits is the ability to make functional and pure UI components. This separates the state and flow from the actual design, which is generally a good thing.

It's very easy to make such a component.

```
import React from 'react'

const Button = ({
  type
  ...props
}) => {
   return (
      <button type={props.type} {...props} />
   )
}

Button.defaultProps = {
   type: 'button'
}

export { Button }
```

When you're working with TypeScript, every piece of code must have a type, your new shiny stateless component as well. 

That’s easier said than done. I couldn't find a good example and had to piece together several resources, like GitHub issues on the TypeScript repository and the React typings file.

I’ve managed to get it working, so I hope you find this before you got frustrated and quit your job.

```
import React from 'react'

const Button : React.StatelessComponent<React.HTMLProps<JSX.Element>> = (props: React.HTMLProps<JSX.Element> & {
    type?:string,
    onClick?:Function
}) => {
    return (
        <button onClick={props.onClick}
            type={props.type}>
            {props.children}
        </button>
    )
}

Button.defaultProps = {
    type: 'button'
}

export { Button }
```

A few notes:

- The React documentation and most articles use the object spread operator (`{ ...props }`) as arguments to a function. Currently, Typescript 2.0 does not support that. It's better to supply each property as a separate argument so you can define the type. Support is coming in version 2.1 if you want to use it anyway.
- You have to implement the interface `React.StatelessComponent` otherwise constructs like `Button.defaultProps` don't work.
- The component should expect a `React.HTMLProps<JSX.Element>` so you can use both regular HTML and React-specific attributes, like `ref` and `children`.

If you have any improvements or comments, feel free to send me a message.
