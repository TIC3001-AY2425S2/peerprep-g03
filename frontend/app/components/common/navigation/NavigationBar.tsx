import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Layout, Space, Typography } from "antd";
import { useLocation, useNavigate } from "react-router";
import { APP_NAME } from "~/constant";
import { useAuth } from "~/contexts/AuthContext";
import NavigationMenu from "./NavigationMenu";

const { Header } = Layout;
const { Title } = Typography;

export default function NavigationBar() {
  const { isAuthenticated, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const hiddenRoutes = ["/login", "/register"];
  const shouldHideMenu =
    hiddenRoutes.includes(location.pathname) || !isAuthenticated;

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingInline: "24px",
      }}
    >
      <Space size="large" align="center">
        <Title level={4} style={{ color: "white", margin: 0 }}>
          {APP_NAME}
        </Title>
        {!shouldHideMenu && <NavigationMenu />}
      </Space>

      {isAuthenticated && (
        <Space size="middle" align="center">
          <div
            onClick={goToProfile}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "2px 10px",
              borderRadius: "999px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: "white",
              height: "38px",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.25)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.15)")
            }
          >
            <Avatar
              size={20}
              style={{ backgroundColor: "#1890ff", fontSize: 12 }}
              icon={<UserOutlined />}
            />
            <span style={{ fontSize: 14, fontWeight: 500 }}>Profile</span>
          </div>

          <Button type="primary" danger onClick={handleLogout}>
            Logout
          </Button>
        </Space>
      )}
    </Header>
  );
}
