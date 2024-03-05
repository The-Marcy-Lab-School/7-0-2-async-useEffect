# 7-0-2-async-useEffect

We've already learned about the `useState` hook. Time for another one! In this lesson, we'll learn how to use the `useEffect` hook to send API fetch requests.

**Table of Contents**
- [Terms](#terms)
- [useEffect](#useeffect)
- [useEffect Syntax](#useeffect-syntax)
  - [1. Import the useEffect hook](#1-import-the-useeffect-hook)
  - [2. Invoke `useEffect` at the TOP of your component with your other hooks.](#2-invoke-useeffect-at-the-top-of-your-component-with-your-other-hooks)
  - [3. Determine your dependency array](#3-determine-your-dependency-array)
- [Fetching with useEffect](#fetching-with-useeffect)
  - [Using a form to trigger the effect](#using-a-form-to-trigger-the-effect)

## Terms

- **Hooks** — Functions that provide a wide variety of features for React components. They all begin with `use()`.
- **`useEffect`** – A react hook for executing "side effects". A side effect is anything that happens outside of React such sending a `fetch` request, starting an animation, or setting up a server connections.

## useEffect

`useEffect` allows our React components to execute "code that produces side effects". We can think of this as **anything that happens outside of React** such as:
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
    document.title = count; // the effect
  }, [count]); // the dependencies

  return (
    <>
      <button onClick={() => setCount((count) => count + 1)}>+</button>
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

When we want to fetch data from an API (a public one or our own API), we will put that fetching logic into a `useEffect` callback.

**Review: how to fetch**

```js
// the function is async so it returns a promise too
const fetchData = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Fetch failed. ${response.status} ${response.statusText}`); // throw an error if the fetch failed
    return await response.json(); // convert incoming json data to js object and return
  } catch (error) {
    console.log(error);
    return null;
  }
};

const doFetch = async () => {
  const data = await fetchData("https://v2.jokeapi.dev/joke/Any");
  if (data) {
    console.log(data.setup); // the setup
    console.log(data.delivery); // the punchline
  }
};

doFetch();
```

In the example, we're using the [joke API](https://sv443.net/jokeapi/v2/). When a joke is request, an object is returned with a `setup` ("what do you call a...?") and a `delivery` (the punchline).

In our application, we can render that joke like this:

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

If we want the `joke` to be set by our fetch call, we need to first use `useState`:

```jsx
function App() {
  const [joke, setJoke] = useState({ delivery: "", setup: "" });

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

Now, let's fetch the joke using the API and `useEffect`:

```jsx
function App() {
  const [joke, setJoke] = useState({ delivery: "", setup: "" });

  useEffect(() => {
    // 1. React wants us to define this function rather than call async code directly
    const doFetch = async () => {
      const responseData = await fetchData("https://v2.jokeapi.dev/joke/Any");
      if (responseData) {
        const { delivery, setup } = responseData;
        setJoke({ delivery, setup });
      }
    };

    // 2. Call the function immediately
    doFetch();
  }, []); // run the effect once

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

### Using a form to trigger the effect

```jsx
function App() {
  const [query, setQuery] = useState("");
  const [joke, setJoke] = useState({ delivery: "", setup: "" });

  useEffect(() => {
    const doFetch = async () => {
      const url = getApiUrl(query);
      const { delivery, setup } = await fetchData(url);
      setJoke({ delivery, setup });
    };
    doFetch();
  }, [query]);

  return (
    <>
      <form>
        <input
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="query"
          value={query}
        ></input>
        <input type="submit" value="submit"></input>
      </form>

      <div className="results">
        <h1>{joke.setup}</h1>
        <details>
          <summary>Reveal</summary>

          <p>{joke.delivery}</p>
        </details>
      </div>
    </>
  );
}
```
