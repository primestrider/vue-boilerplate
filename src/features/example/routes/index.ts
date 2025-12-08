import type { RouteRecordRaw } from "vue-router"

import { ExamplePageName } from "../models"

const featureARoutes: RouteRecordRaw[] = [
  {
    path: "/example",
    name: ExamplePageName.EXAMPLE,
    component: () => import("@/features/example/views/ExampleView.vue"),
  },
]

export default featureARoutes
