package assets

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

var TranslationsMap map[string]string
var TranslationsPack map[string]Translation

type Translation struct {
	Hash      string
	LangShort string

	Content Root
}

func LoadAssetsPackTranslationsGitHub(ctx context.Context, url string,
	translationsPath string) (map[string]Translation, map[string]string, error) {

	repositoryPath, err := UpdateRepository(ctx, url)
	if err != nil {
		return nil, nil, err
	}

	files, err := filepath.Glob(filepath.Join(repositoryPath, translationsPath, "*.json"))
	if err != nil {
		return nil, nil, fmt.Errorf("find translation files: %w", err)
	}
	sort.Strings(files)

	pack := make(map[string]Translation)
	translations := make(map[string]string)
	for _, filePath := range files {
		file, err := os.Open(filePath)
		if err != nil {
			return nil, translations, fmt.Errorf("open translation %q: %w", filePath, err)
		}

		var content Root
		decodeErr := json.NewDecoder(file).Decode(&content)
		closeErr := file.Close()
		if decodeErr != nil {
			if filepath.Base(filePath) == "en.json" {
				return nil, translations, fmt.Errorf("decode translation %q: %w", filePath, decodeErr)
			}

			continue
		}
		if closeErr != nil {
			return nil, translations, fmt.Errorf("close translation %q: %w", filePath, closeErr)
		}

		hash, err := hashFile(filePath)
		if err != nil {
			return nil, translations, fmt.Errorf("hash translation %q: %w", filePath, err)
		}

		translations[strings.ToLower(content.Language.Short)] = hash

		pack[strings.ToLower(content.Language.Short)] = Translation{
			Hash: hash,

			LangShort: content.Language.Short,
			Content:   content,
		}
	}

	return pack, translations, nil
}

func DemonUpdateAssetsPackTranslationsGitHub(ctx context.Context,
	url string,
	translationsPath string,
) (map[string]Translation, map[string]string, error) {
	for {
		select {
		case <-ctx.Done():
			return nil, nil, ctx.Err()
		default:
			pack, translations, err := LoadAssetsPackTranslationsGitHub(ctx, url, translationsPath)
			if err != nil {
				fmt.Printf("Error loading assets pack translations: %v\n", err)
				continue
			}

			TranslationsPack = pack
			TranslationsMap = translations
		}
	}
}

func hashFile(filePath string) (string, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	digest := sha256.New()
	if _, err := io.Copy(digest, file); err != nil {
		return "", err
	}

	return hex.EncodeToString(digest.Sum(nil)), nil
}
