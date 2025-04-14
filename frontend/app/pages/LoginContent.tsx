import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Space, Typography } from "antd";
import { useState } from "react";

import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import type { LoginPayload } from "../types/User";

const { Title, Text } = Typography;

const LoginContent: React.FC = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginPayload) => {
    setLoading(true);
    const result = await loginUser(values);
    setLoading(false);

    if (result.success) {
      message.success("Login successful");
      navigate("/");
    } else {
      message.error(result.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <Form
        name="login_form"
        onFinish={onFinish}
        layout="vertical"
        style={styles.form}
      >
        <Title level={2} style={styles.title}>
          Login
        </Title>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Enter your email"
            style={styles.input}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your password"
            style={styles.input}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={styles.button}
          >
            Login
          </Button>
        </Form.Item>

        <Space direction="vertical" size="small">
          <Text type="secondary">
            Don&apos;t have an account? <Link to="/register">Register now</Link>
          </Text>
        </Space>
      </Form>
    </div>
  );
};

// Reference: https://www.youtube.com/watch?v=Ibp-W3cPnbo
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    padding: "2rem",
    background:
      "url(https://gov-web.s3.ap-northeast-1.amazonaws.com/uploads/2018/04/NUS-ERC.jpg) no-repeat center center",
    backgroundSize: "cover",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    padding: "2rem",
    borderRadius: "15px",
    background: "rgba(255, 255, 255, 0.15)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    color: "#fff",
  },
  title: {
    color: "#000",
    textAlign: "center",
    marginBottom: "2rem",
  },
  input: {
    borderRadius: 6,
  },
  button: {
    borderRadius: 6,
  },
};

export default LoginContent;
