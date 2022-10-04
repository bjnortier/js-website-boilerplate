import { createRoot } from "react-dom/client"
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom"
import ContactDetails from "./ContactDetails"

const Home = () => {
  return (
    <div id="contents">
      <ContactDetails />
    </div>
  )
}

const Foo = () => {
  return <>Foo</>
}

const ErrorPage = () => {
  const error: any = useRouteError()
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "foo",
    element: <Foo />,
  },
])

const container = document.getElementById("app")
if (container === null) {
  throw "element with id 'app' element not found"
} else {
  const root = createRoot(container)
  root.render(<RouterProvider router={router} />)
}
