package notification

import (
	"context"
	"encoding/json"

	"ngantri/backend/internal/domain"
)

type Message struct {
	BusinessID string
	CustomerID *string
	Type       domain.NotificationEvent
	Channel    string
	Recipient  string
	Payload    map[string]any
}

type Sender interface {
	Send(ctx context.Context, message Message) error
}

type MockSender struct {
	Log func(ctx context.Context, message Message, payloadJSON []byte) error
}

func (sender MockSender) Send(ctx context.Context, message Message) error {
	payloadJSON, err := json.Marshal(message.Payload)
	if err != nil {
		return err
	}
	if sender.Log == nil {
		return nil
	}
	return sender.Log(ctx, message, payloadJSON)
}
