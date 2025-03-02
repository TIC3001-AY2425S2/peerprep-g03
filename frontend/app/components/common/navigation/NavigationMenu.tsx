import { Menu } from "antd";
import { Link } from "react-router";

const menuItems = [
  { key: "/", label: <Link to="/">Home</Link> },
  { key: "/question", label: <Link to="/question">Question</Link> },
];

export default function NavigationMenu() {
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[location.pathname]}
      items={menuItems}
    />
  );
}
