// Code generated by protoc-gen-a2config. DO NOT EDIT.
// source: config/cereal/config_request.proto

package cereal

import (
	a2conf "github.com/chef/automate/components/automate-grpc/protoc-gen-a2-config/api/a2conf"
	wrappers "github.com/golang/protobuf/ptypes/wrappers"
)

// ServiceName returns the name of the service this config belongs to
func (m *ConfigRequest) ServiceName() string {
	return "cereal-service"
}

// BindPort sets the port tagged with the given name
func (m *ConfigRequest) BindPort(name string, value uint16) error {
	switch name {
	case "service":
		v0 := &m.V1
		if *v0 == nil {
			*v0 = &ConfigRequest_V1{}
		}
		v1 := &(*v0).Sys
		if *v1 == nil {
			*v1 = &ConfigRequest_V1_System{}
		}
		v2 := &(*v1).Service
		if *v2 == nil {
			*v2 = &ConfigRequest_V1_System_Service{}
		}
		v3 := &(*v2).Port
		*v3 = &wrappers.Int32Value{Value: int32(value)}
	default:
		return a2conf.ErrPortNotFound
	}
	return nil
}

// ListPorts lists all the ports exposed by the config
func (m *ConfigRequest) ListPorts() []a2conf.PortInfo {
	return []a2conf.PortInfo{a2conf.PortInfo{
		Default:  uint16(int32(10101)),
		Name:     "service",
		Protocol: "grpc",
	}}
}

// GetPort gets the port tagged with the given name. If the value is not set, it returns 0.
func (m *ConfigRequest) GetPort(name string) (uint16, error) {
	switch name {
	case "service":
		v0 := m.V1
		if v0 == nil {
			return 0, nil
		}
		v1 := v0.Sys
		if v1 == nil {
			return 0, nil
		}
		v2 := v1.Service
		if v2 == nil {
			return 0, nil
		}
		v3 := v2.Port
		return uint16(v3.GetValue()), nil
	default:
		return 0, a2conf.ErrPortNotFound
	}
}

// ListSecrets lists all the secrets exposed by the config
func (m *ConfigRequest) ListSecrets() []a2conf.SecretInfo {
	return []a2conf.SecretInfo{}
}

// GetSecret gets a secret by name. Returns nil if it is not set
func (m *ConfigRequest) GetSecret(name string) *wrappers.StringValue {
	return nil
}
