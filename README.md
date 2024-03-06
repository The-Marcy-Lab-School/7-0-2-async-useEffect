# Fetching and useEffect

We've already learned about one hook, `useState`. Time for another one! In this lesson, we'll learn how to use the `useEffect` hook to send API fetch requests.

**Table of Contents**
- [Terms](#terms)
- [useEffect](#useeffect)
- [useEffect Syntax](#useeffect-syntax)
  - [1. Import the useEffect hook](#1-import-the-useeffect-hook)
  - [2. Invoke `useEffect` at the TOP of your component with your other hooks.](#2-invoke-useeffect-at-the-top-of-your-component-with-your-other-hooks)
  - [3. Determine your dependency array](#3-determine-your-dependency-array)
- [Fetching with useEffect](#fetching-with-useeffect)
  - [Handling Errors](#handling-errors)
  - [We can still fetch in response to events:](#we-can-still-fetch-in-response-to-events)
  - [Using a Form input to re-run the effect](#using-a-form-input-to-re-run-the-effect)

## Terms

- **Hooks** — Functions that provide a wide variety of features for React components. They all begin with `use()`.
- **`useEffect`** – A react hook for executing "side effects" when a component renders. 
  - A side effect is anything that happens outside of React such sending a `fetch` request, starting an animation, or setting up a server connections.
  - You can still perform side effects in response to events without `useEffect`
- **Dependency Array** — The array of values provided to `useEffect` that React will watch for changes. If changes occur in the dependency array, the effect will run again.

## useEffect

`useEffect` allows our React components to execute code that produces "side effects" when the component renders. 

We can think of a side effect in react as **anything that happens outside of React** such as:
* sending a `fetch` request
* starting an animation
* setting up a server connections
* modifying the DOM directly
* etc...

In the example below, we have a piece of state called `count` and we are using that value to dynamically update the `document.title`. 

React is not in the business of direct DOM manipulation, so we create an _effect_ using `useEffect`.

```jsx
import { useState, useEffect } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = count;
  }, [count]); 

  const handleClick = () => {
    setCount((count) => count + 1);
    // document.title = count; // <-- bad
  }

  return (
    <>
      <button onClick={handleClick}>+</button>
      <p>{count}</p>
    </>
  );
}
```

The flow of control looks like this:
1. The `Counter` component is rendered with a starting state of `count = 0`
2. The effect is executed after the component renders, updating the document's `title`.
3. A user clicks on the button, invoking `setCount()`, triggering a re-render of `Counter` with a state of `count = 1`
4. `useEffect` checks the dependency array for any changes since the last render. `count` has been updated so it runs again, updating the document's `title`.

![](./notes-img/useEffect-render-cycle.svg)

## useEffect Syntax

Let's look at the steps involved to dynamically update the `document.title` using `useEffect`

### 1. Import the useEffect hook

```jsx
import { useEffect } from "react"; // when importing alone
import { useState, useEffect } from "react"; // when importing alongside other named exports
```

- `useEffect` is a _named export_ of the `react` package, just like `useState`.

### 2. Invoke `useEffect` at the TOP of your component with your other hooks.

```jsx
import { useState, useEffect } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = count;
  }, [count]); // re-run the effect whenever count changes

  // return the component
};
```

- `useEffect(effect, dependencies)` takes in two arguments
  1. an `effect` callback function to execute when the component is first rendered
  2. (optional) a `dependencies` array of state values to track.
- If the dependency array is provided, the effect will be only re-run on future renders if any of those dependency values are updated.

### 3. Determine your dependency array

```jsx
useEffect(() => {
    document.title = count;
  }, [count]); // re-run the effect whenever count changes

useEffect(() => {
  document.title = count;
}, []); // only execute the effect once

useEffect(() => {
  document.title = count;
}); // execute after EVERY re-render
```

- If the dependency array is provided, the effect will be only re-run on future renders if any of those dependency values are updated.
- If the array is empty, the effect is only executed on the first render of the component.
- If the array is omitted, the effect is executed on EVERY render of the component.

## Fetching with useEffect

Often, we want to fetch data from an API (a public one or our own API) when a component renders.

Check out the `1-fetch-example-start` React project. In our application, we can render that joke like this:

```jsx
// lets start with a hard-coded joke
const joke = {
  setup: "What do you call a pile of cats?",
  delivery: "A meowntain",
};

function App() {
  return (
    <>
      <div className="joke">
        <h1>{joke.setup}</h1>
        <p>{joke.delivery}</p>
      </div>
    </>
  );
}
```

Instead of hard-coding the joke, let's load a random joke from the [joke API](https://sv443.net/jokeapi/v2/). When a joke is requested, a similar object is returned with a `setup` ("what do you call a...?") and a `delivery` (the punchline).

```jsx
const defaultJoke = {
  setup: "What do you call a pile of cats?",
  delivery: "A meowntain",
};

function App() {
  const [joke, setJoke] = useState(defaultJoke);

  return (
    <>
      <div className="joke">
        <h1>{joke.setup}</h1>
        <p>{joke.delivery}</p>
      </div>
    </>
  );
}
```

* We turned the `joke` into a piece of state using the `defaultJoke` as a starting value.
* We will invoke `setJoke` when the fetch returns:

Now, let's fetch the joke using the API and `useEffect`. Unfortunately, we can't make the callback async:

```jsx
// this doesn't work
useEffect(async () => {
  const response = await fetch()
  // ....
}, []);
```

So, inside of the callback, we make an `async` function that does the fetch and then invoke it immediately.

```jsx
function App() {
  const [joke, setJoke] = useState(defualtJoke);

  useEffect(() => {
    const doFetch = async () => {
      const url = "https://v2.jokeapi.dev/joke/Any";
      const [data, error] = await fetchData(url);
      if (data) setJoke(data);
    };
    doFetch();
  }, []);

  // return JSX to render the joke
}
```

> For a refresher on how to fetch, look at the `src/utils/fetchData.js` helper function. It returns a `[data, error]` tuple.

**<details><summary style="color: purple">Q: When / how many times will this effect run?</summary>**
> Only one time, on the first render, because the dependency array is empty.
</details><br>

### Handling Errors

If an error occurs, it is important to let the user know in some way. There are many ways of doing this but here is a very simple one:

```jsx
function App() {
  const [joke, setJoke] = useState(defualtJoke);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const doFetch = async () => {
      const url = "https://v2.jokeapi.dev/joke/Any";
      const [data, error] = await fetchData(url);
      if (data) setJoke(data);
      if (error) setError(error);
    };
    doFetch();
  }, []);

  // conditional rendering for the win!
  if (errorMessage) return <p>{errorMessage}</p>

  return (
    <>
      <div className="joke">
        <h1>{joke.setup}</h1>
        <p>{joke.delivery}</p>
      </div>
    </>
  );
}
```

Here, we render different JSX depending on if the `errorMessage` was set.

### We can still fetch in response to events:

In this example, we run the fetch once when the component first renders and then again in response to the `onSubmit` event for the form.

```jsx
function App() {
  const [joke, setJoke] = useState(defaultJoke);
  const [errorMessage, setErrorMessage] = useState('');
  const [input, setInput] = useState("");
  
  useEffect(() => {
    const doFetch = async () => {
      const url = 'https://v2.jokeapi.dev/joke/Any';
      const [data, error] = await fetchData(url);
      if (data) setJoke(data);
      if (error) setError(error);
    };
    doFetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `https://v2.jokeapi.dev/joke/Any&contains=${input}`
    const [data, error] = await fetchData(url);
    if (data) setJoke(data);
    if (error) setError(error);
    setInput('');
  }

  if (errorMessage) return <p>{errorMessage}</p>

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="query"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button>Submit</button>
      </form>

      <div className="joke">
        <h1>{joke.setup}</h1>
        <p>{joke.delivery}</p>
      </div>
    </>
  );
}
```

### Using a Form input to re-run the effect

Sometimes, we DO want to connect the form inputs directly to the effect. In this example, we add the `input` from the form to the dependency array.

**<details><summary style="color: purple">Q: When / how many times will this effect run?</summary>**
> Each time the `onChange` event fires (every input change)
</details><br>

```jsx
function App() {
  const [joke, setJoke] = useState(defaultJoke);
  const [errorMessage, setErrorMessage] = useState('');
  const [input, setInput] = useState("");

  useEffect(() => {
    const doFetch = async () => {
      const url = "https://v2.jokeapi.dev/joke/Any";
      const [data, error] = await fetchData(url);
      if (data) setJoke(data);
      if (error) setError(error);
    };
    doFetch();
  }, [input]);

  if (errorMessage) return <p>{errorMessage}</p>

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="query"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button>Submit</button>
      </form>

      <div className="joke">
        <h1>{joke.setup}</h1>
        <p>{joke.delivery}</p>
      </div>
    </>
  );
}
```



