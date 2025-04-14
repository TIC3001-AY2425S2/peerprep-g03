import type { PopconfirmProps } from "antd";
import {
  App,
  Button,
  Card,
  Col,
  Form,
  Input,
  Popconfirm,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import { deleteUser, getUserById, updateUser } from "../services/user-services";
import type { UserProfile } from "../types/User";

const { Title, Text } = Typography;

export default function ProfileContent() {
  const { message } = App.useApp();
  const { jwtPayload: jwtPayload, isAuthInitialized, logoutUser } = useAuth();
  const userId = jwtPayload?.id;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const [formValid, setFormValid] = useState(false);

  const fetchProfile = async () => {
    if (!userId) {
      message.error("Missing user ID or token.");
      setLoading(false);
      return;
    }

    try {
      const result = await getUserById(userId);
      if (result.success && result.data) {
        const { username, email, createdAt } = result.data;
        setProfile({ username, email, createdAt });
        form.setFieldsValue({ username, email });
      } else {
        message.error(result.message || "Failed to load profile.");
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong while loading profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const result = await updateUser(userId!, values);
      if (result.success) {
        message.success("Profile updated successfully");
        setEditing(false);
        fetchProfile();
        form.resetFields();
      } else {
        message.error(result.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setEditing(false);
  };

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    const isAllFieldsFilled = Object.values(values).every((value) => {
      return typeof value === "string"
        ? value.trim() !== ""
        : value !== null && value !== undefined;
    });
    setFormValid(isAllFieldsFilled);
  };

  const handleDeleteAccount: PopconfirmProps["onConfirm"] = async () => {
    try {
      if (!userId) throw new Error("Missing userId or token");

      const result = await deleteUser(userId);
      if (result.success) {
        message.success("Account deleted successfully");
        logoutUser();
      } else {
        message.error(result.message || "Failed to delete account");
      }
    } catch (err) {
      console.error(err);
      message.error("Something went wrong while deleting the account.");
    }
  };

  const handleCancelDelete: PopconfirmProps["onCancel"] = () => {
    message.info("Account deletion was cancelled");
  };

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  if (!isAuthInitialized || loading) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ textAlign: "center", padding: "2rem", color: "gray" }}>
        No profile data available.
      </div>
    );
  }

  return (
    <Card
      variant="borderless"
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Row gutter={32}>
        <Col span={24} md={7}>
          <div style={{ paddingLeft: 12, marginBottom: 24 }}>
            <Title level={4} style={{ marginBottom: 4 }}>
              Profile
            </Title>
            <Text type="secondary">
              Update your profile or security credentials.
            </Text>
          </div>
        </Col>

        <Col span={24} md={17}>
          <Form
            layout="vertical"
            form={form}
            initialValues={profile}
            onValuesChange={handleFormChange}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Username is required" }]}
              style={{ marginBottom: 12 }}
            >
              <Input disabled={!editing} />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Invalid email format" },
              ]}
              style={{ marginBottom: 12 }}
            >
              <Input disabled={!editing} />
            </Form.Item>

            {editing && (
              <>
                <Form.Item
                  label="New Password"
                  name="password"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please enter your new password",
                    },
                    { min: 12, message: "Minimum 12 characters required" },
                    {
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/,
                      message: "Your password is too weak",
                    },
                  ]}
                  style={{ marginBottom: 12 }}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  label="Confirm New Password"
                  name="confirmPassword"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || value === getFieldValue("password")) {
                          return Promise.resolve();
                        }
                        return Promise.reject("Passwords do not match");
                      },
                    }),
                  ]}
                  style={{ marginBottom: 12 }}
                >
                  <Input.Password />
                </Form.Item>
              </>
            )}

            <Form.Item label="Created At">
              <Input
                value={new Date(profile.createdAt).toLocaleString()}
                disabled
                style={{ marginBottom: 12 }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 20, textAlign: "right" }}>
              {editing ? (
                <Space>
                  <Button
                    type="primary"
                    onClick={handleSave}
                    disabled={!formValid}
                  >
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel}>Cancel</Button>
                </Space>
              ) : (
                <Space>
                  <Button type="primary" onClick={() => setEditing(true)}>
                    Edit Profile
                  </Button>
                  <Popconfirm
                    title="Delete Account"
                    description="Are you sure to delete your account?"
                    onConfirm={handleDeleteAccount}
                    onCancel={handleCancelDelete}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger>Delete Account</Button>
                  </Popconfirm>
                </Space>
              )}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );
}
