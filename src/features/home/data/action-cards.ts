import type { ActionCard } from "../../../types/product.js";

export const actionCards: ActionCard[] = [
  {
    id: "buyer",
    title: "Acheter",
    description: "Trouvez le bien idéal qui vous correspond",
    icon: "home",
    scene: "house",
  },
  {
    id: "seller",
    title: "Vendre",
    description: "Vendez au meilleur prix et en toute sérénité",
    icon: "key",
    scene: "living",
  },
  {
    id: "estimate",
    title: "Estimer",
    description: "Obtenez une estimation précise de votre bien",
    icon: "chart",
    scene: "building",
  },
];
