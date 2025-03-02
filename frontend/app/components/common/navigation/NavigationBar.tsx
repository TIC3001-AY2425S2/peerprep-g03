import { APP_NAME } from "~/constant";
import NavigationMenu from "./NavigationMenu";

export default function NavigationBar() {
  return (
    <>
      <div
        style={{
          color: "white",
          fontSize: "20px",
          fontWeight: "bold",
          marginRight: "40px",
        }}
      >
        {APP_NAME}
      </div>
      <NavigationMenu />
    </>
  );
}
