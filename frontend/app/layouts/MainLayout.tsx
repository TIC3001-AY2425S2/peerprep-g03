import { Layout as AntLayout } from "antd";
import { Outlet } from "react-router";
import { APP_NAME } from "~/constant";
import NavigationBar from "../components/common/navigation/NavigationBar";

const { Content, Footer } = AntLayout;

export default function MainLayout() {
  return (
    <AntLayout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavigationBar />

      <Content
        style={{
          flex: 1,
          padding: "24px 48px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Content>

      <Footer
        style={{
          textAlign: "center",
          padding: "16px",
          fontSize: "0.75rem",
          color: "#888",
        }}
      >
        {APP_NAME} - Group 3
      </Footer>
    </AntLayout>
  );
}
