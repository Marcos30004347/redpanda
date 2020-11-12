// Copyright 2020 Vectorized, Inc.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.md
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0

package redpanda

import (
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"

	log "github.com/sirupsen/logrus"
	"golang.org/x/sys/unix"
)

type Launcher interface {
	Start() error
}

type RedpandaArgs struct {
	ConfigFilePath string
	SeastarFlags   map[string]string
	ExtraArgs      []string
}

func NewLauncher(installDir string, args *RedpandaArgs) Launcher {
	return &launcher{
		installDir: installDir,
		args:       args,
	}
}

type launcher struct {
	installDir string
	args       *RedpandaArgs
}

func (l *launcher) Start() error {
	binary, err := l.getBinary()
	if err != nil {
		return err
	}

	if l.args.ConfigFilePath == "" {
		return errors.New("Redpanda config file is required")
	}
	redpandaArgs := collectRedpandaArgs(l.args)
	log.Debugf("Starting '%s' with arguments '%v'", binary, redpandaArgs)

	var rpEnv []string
	ldLibraryPathPattern := regexp.MustCompile("^LD_LIBRARY_PATH=.*$")
	for _, ev := range os.Environ() {
		if !ldLibraryPathPattern.MatchString(ev) {
			rpEnv = append(rpEnv, ev)
		}
	}
	log.Infof("Running:\n%s %s %s", strings.Join(rpEnv, " "), binary, strings.Join(redpandaArgs, " "))
	return unix.Exec(binary, redpandaArgs, rpEnv)
}

func (l *launcher) getBinary() (string, error) {
	path, err := exec.LookPath(filepath.Join(l.installDir, "bin", "redpanda"))
	if err != nil {
		return "", err
	}
	return path, nil
}

func collectRedpandaArgs(args *RedpandaArgs) []string {
	redpandaArgs := []string{
		"redpanda",
		"--redpanda-cfg",
		args.ConfigFilePath,
	}

	singleFlags := []string{"overprovisioned"}

	isSingle := func(f string) bool {
		for _, flag := range singleFlags {
			if flag == f {
				return true
			}
		}
		return false
	}

	for flag, value := range args.SeastarFlags {
		single := isSingle(flag)
		if single && value != "true" {
			// If it's a 'single'-type flag and it's set to false,
			// then there's no need to include it.
			continue
		}
		if single || value == "" {
			redpandaArgs = append(redpandaArgs, "--"+flag)
			continue
		}
		redpandaArgs = append(
			redpandaArgs,
			fmt.Sprintf("--%s=%s", flag, value),
		)
	}
	return append(redpandaArgs, args.ExtraArgs...)
}
