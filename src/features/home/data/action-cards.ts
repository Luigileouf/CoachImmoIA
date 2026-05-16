import type { ActionCard } from "../../../types/product";

export const actionCards: ActionCard[] = [
  {
    id: "buyer",
    title: "Acheter",
    description: "Trouvez le bien ideal qui vous correspond",
    icon: "home",
    scene: "house",
  },
  {
    id: "seller",
    title: "Vendre",
    description: "Vendez au meilleur prix et en toute serenite",
    icon: "key",
    scene: "living",
  },
  {
    id: "estimate",
    title: "Estimer",
    description: "Obtenez une estimation precise de votre bien",
    icon: "chart",
    scene: "building",
  },
];
