package auth

import "testing"

func TestVerifyDemoOwnerPasswordHash(t *testing.T) {
	hash := "argon2id$RvhtLa9LU5YWHJBh3V2uAQ$BS4l2PEyD8I2pdeZ1jiDkkdY0VupGL4NG8RnhiBS9xk"
	if !VerifyPassword("DemoOwner123!", hash) {
		t.Fatal("demo owner password hash should verify")
	}
}
