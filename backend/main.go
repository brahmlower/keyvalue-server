package main

import (
	"fmt"
	"io"
	"net/http"

	"github.com/brahmlower/keyvalue-server/storageservice"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
)

func storageResponse(item storageservice.StorageItem, res http.ResponseWriter) {
	res.Header().Add("Content-Type", item.ContentType)
	res.Header().Add("ETag", fmt.Sprintf("%x", item.Sha1))
	res.WriteHeader(200)
	res.Write(item.Data)
}

// Create a buffer to read the body into. Request bodies may be chunked so we read the
// body continually until reaching EOF or until no more bytes are read
func readBody(req *http.Request) ([]byte, error) {
	body := make([]byte, 0)
	for {
		data_chunk := make([]byte, req.ContentLength)
		bytes_read, err := req.Body.Read(data_chunk)
		body = append(body, data_chunk[0:bytes_read]...)
		fmt.Printf("bytes read: %#v\n", bytes_read)
		if err == io.EOF || bytes_read == 0 {
			break
		} else if err != nil {
			return nil, fmt.Errorf("Failed to read request body")
		}
	}
	return body, nil
}

func ApiItemList(r render.Render, storage *storageservice.StorageService) {
	response := storage.GetKeys()
	r.JSON(200, response)
}

func ApiItemGet(params martini.Params, res http.ResponseWriter, storage *storageservice.StorageService) {
	key_name := params["key_name"]
	item := storage.GetKey(key_name)
	storageResponse(item, res)
}

func ApiItemSet(params martini.Params, req *http.Request, res http.ResponseWriter, storage *storageservice.StorageService) {
	key_name := params["key_name"]

	key_value, err := readBody(req)
	if err != nil {
		res.Header().Add("Content-Type", "application/text")
		res.WriteHeader(500)
		res.Write([]byte(err.Error()))
		return
	}

	// Save the data and return the success response
	contentType := req.Header.Get("Content-Type")
	item := storage.SetKey(key_name, key_value, contentType)
	storageResponse(item, res)
}

func ApiItemDelete(params martini.Params, res http.ResponseWriter, storage *storageservice.StorageService) {
	key_name := params["key_name"]
	storage.DeleteKey(key_name)
	res.WriteHeader(204)
}

func main() {
	// initialize the storage service
	storage := storageservice.New()

	// initialize the webserver
	m := martini.Classic()

	m.Use(render.Renderer(render.Options{
		Charset: "UTF-8",
	}))

	m.Map(storage)

	m.Get("/keys", ApiItemList)
	m.Get("/keys/:key_name", ApiItemGet)
	m.Put("/keys/:key_name", ApiItemSet)
	m.Delete("/keys/:key_name", ApiItemDelete)

	m.Run()
}
