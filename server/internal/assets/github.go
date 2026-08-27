package assets

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

func UpdateRepository(ctx context.Context, url string) (string, error) {
	repoDir := filepath.Join(os.TempDir(), "telefy-assets")

	if _, err := os.Stat(filepath.Join(repoDir, ".git")); os.IsNotExist(err) {
		if err := runGit(ctx, "clone", url, repoDir); err != nil {
			return "", err
		}
	} else {
		if err := runGit(ctx, "-C", repoDir, "pull", "--ff-only"); err != nil {
			return "", err
		}
	}

	return repoDir, nil
}

func runGit(ctx context.Context, args ...string) error {
	command := exec.CommandContext(ctx, "git", args...)
	output, err := command.CombinedOutput()
	if err != nil {
		return fmt.Errorf("git %v: %w: %s", args, err, output)
	}

	return nil
}
