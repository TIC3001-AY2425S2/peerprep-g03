import { Layout as AntLayout } from "antd";
import { Outlet } from "react-router";
import { APP_NAME } from "~/constant";
import NavigationBar from "../components/common/navigation/NavigationBar";

const { Header, Content, Footer } = AntLayout;

export default function MainLayout() {
  return (
    <AntLayout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header style={{ display: "flex", alignItems: "center" }}>
        <NavigationBar />
      </Header>

      <Content
        style={{
          flex: 1,
          padding: "48px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Content>

      <Footer style={{ textAlign: "center" }}>{APP_NAME} - Group 3</Footer>
    </AntLayout>
  );
}
