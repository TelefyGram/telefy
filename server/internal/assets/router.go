package assets

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func GetHashFromLangShortMap(translations map[string]string, langShort string) (string, bool) {
	hash, ok := translations[langShort]
	return hash, ok
}

const hashContextKey = "translationHash"

func HashByLangMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		langShort := strings.ToLower(ctx.Query("lang"))
		if langShort == "" {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
				"error": "lang query parameter is required",
			})
			return
		}

		hash, ok := GetHashFromLangShortMap(TranslationsMap, langShort)
		if !ok {
			ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
				"error": "translation not found",
			})
			return
		}

		ctx.Set(hashContextKey, hash)
		ctx.Next()
	}
}

func GetHashFromLangShort(ctx *gin.Context) {
	hash, exists := ctx.Get(hashContextKey)
	if !exists {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"error": "translation hash is unavailable",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"hash": hash})
}

func GetTranslationJson(ctx *gin.Context) {
	langShort := strings.ToLower(ctx.Query("lang"))
	if langShort == "" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "lang query parameter is required",
		})
		return
	}

	translation, exists := TranslationsPack[langShort]
	if !exists {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"error": "translation not found",
		})
		return
	}

	ctx.JSON(http.StatusOK, translation.Content)
}
