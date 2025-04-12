import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { App, Button, Form, Input, Space, Typography } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { registerUser } from "../services/auth-services";
import type { RegisterPayload } from "../types/User";

const { Title, Text } = Typography;

const RegisterContent: React.FC = () => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: RegisterPayload) => {
    setLoading(true);
    try {
      const result = await registerUser(values);
      if (result.success) {
        message.success("Registration successful! You can now login.");
        navigate("/login");
      } else {
        message.error(result.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      message.error("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Form
        name="register_form"
        onFinish={onFinish}
        layout="vertical"
        style={styles.form}
      >
        <Title level={2} style={styles.title}>
          Register
        </Title>

        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter a username" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Enter your username"
            style={styles.input}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Enter your email"
            style={styles.input}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your password" },
            {
              min: 12,
              message: "Minimum 12 characters required",
            },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/,
              message: "Your password is too weak",
            },
          ]}
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
            Register
          </Button>
        </Form.Item>

        <Space direction="vertical" size="small">
          <Text type="secondary">
            Already have an account? <Link to="/login">Login</Link>
          </Text>
        </Space>
      </Form>
    </div>
  );
};

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

export default RegisterContent;
