// Named path params from patterns like /items/:id
type t_RouteParams = Record<string, string>;

// Single SPA route
type t_Route = {
  path: string;
  name: string;
  mount: (params: t_RouteParams) => void;
  unmount?: () => void;
};

// Router constructor options
type t_RouterOptions = {
  routes: t_Route[];
  notFound: t_Route;
  onChange?: (path: string, name: string, params: t_RouteParams) => void;
};

// Match result
type t_RouteMatch = {
  route: t_Route;
  params: t_RouteParams;
};

// Page block lifecycle context
type t_PageContext = {
  navigate: (to: string, replace?: boolean) => void;
  params?: t_RouteParams;
};

// Page block contract
type t_PageBlock = {
  getMarkup: () => string;
  init: (ctx: t_PageContext) => void | (() => void);
  destroy?: () => void;
};
