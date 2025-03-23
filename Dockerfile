FROM rabbitmq:3.11-management

RUN apt-get update && apt-get install -y wget

RUN wget https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/3.11.1/rabbitmq_delayed_message_exchange-3.11.1.ez -P /plugins/

RUN rabbitmq-plugins enable rabbitmq_delayed_message_exchange