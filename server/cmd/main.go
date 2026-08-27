package main

import (
	"context"
	"net/http"
	"telefy/internal/assets"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:8080")
		c.Header("Access-Control-Allow-Methods", "GET, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	go assets.DemonUpdateAssetsPackTranslationsGitHub(context.Background(),
		"https://github.com/TelefyGram/langs.git", "langs")

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	r.GET("/hash", assets.HashByLangMiddleware(), assets.GetHashFromLangShort)
	r.GET("/translation", assets.HashByLangMiddleware(), assets.GetTranslationJson)

	r.Run(":16100")
}
