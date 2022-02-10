package main

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/brahmlower/keyvalue-server/storageservice"
	"github.com/go-martini/martini"
)

const itemName = "foo"

var itemValue = []byte("bar")

const itemContentType = "text/plain"

func testStorage() *storageservice.StorageService {
	storage := storageservice.New()
	storage.SetKey(itemName, []byte("bar"), itemContentType)
	return storage
}

func defaultServer(builder func(*martini.ClassicMartini)) *martini.ClassicMartini {
	m := InitMartini()
	m.Map(testStorage())
	builder(m)
	return m
}

func TestApiItemList(t *testing.T) {
	// Setup
	m := defaultServer(func(m *martini.ClassicMartini) {
		m.Get("/keys", ApiItemList)
	})

	// Request recorder
	res := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/keys", nil)

	// Execute the test
	m.ServeHTTP(res, req)

	// Assertions
	if res.Code != http.StatusOK {
		t.Errorf("Expected StatusOk, but got %#v\n", res.Code)
	}

	expectedResponse := "[\"foo\"]"
	if res.Body.String() != expectedResponse {
		t.Errorf("Expected body to equal %#v, but got %#v", expectedResponse, res.Body.String())
	}
}

func TestApiItemGet(t *testing.T) {
	// Setup
	m := defaultServer(func(m *martini.ClassicMartini) {
		m.Get("/keys/:key_name", ApiItemGet)
	})

	// Request recorder
	res := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/keys/"+itemName, nil)

	// Execute the test
	m.ServeHTTP(res, req)

	// Assertions
	if res.Code != http.StatusOK {
		t.Errorf("Expected StatusOk, but got %#v\n", res.Code)
	}

	expectedResponse := "bar"
	if res.Body.String() != expectedResponse {
		t.Errorf("Expected body to equal %#v, but got %#v", expectedResponse, res.Body.String())
	}

	if res.Header().Get("content-type") != itemContentType {
		t.Errorf("Expected content-type to equal %#v, but got %#v", itemContentType, res.Header().Get("content-type"))
	}
}

func TestApiItemGet404(t *testing.T) {
	// Setup
	m := defaultServer(func(m *martini.ClassicMartini) {
		m.Get("/keys/:key_name", ApiItemGet)
	})

	// Request recorder
	res := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/keys/bar", nil)

	// Execute the test
	m.ServeHTTP(res, req)

	// Assertions
	if res.Code != http.StatusNotFound {
		t.Errorf("Expected StatusNotFound, but got %#v\n", res.Code)
	}
}

func TestApiItemPut(t *testing.T) {
	// Setup
	m := defaultServer(func(m *martini.ClassicMartini) {
		m.Put("/keys/:key_name", ApiItemSet)
	})

	updatedValue := []byte("baz")

	// Request recorder
	res := httptest.NewRecorder()
	req, _ := http.NewRequest("PUT", "/keys/"+itemName, bytes.NewReader(updatedValue))

	// Execute the test
	m.ServeHTTP(res, req)

	// Assertions
	if res.Code != http.StatusOK {
		t.Errorf("Expected StatusOk, but got %#v\n", res.Code)
	}

	if res.Body.String() != string(updatedValue) {
		t.Errorf("Expected body to equal %#v, but got %#v", updatedValue, res.Body.String())
	}
}

func TestApiItemDelete(t *testing.T) {
	// Setup
	m := defaultServer(func(m *martini.ClassicMartini) {
		m.Delete("/keys/:key_name", ApiItemDelete)
	})

	// Request recorder
	res := httptest.NewRecorder()
	req, _ := http.NewRequest("DELETE", "/keys/"+itemName, nil)

	// Execute the test
	m.ServeHTTP(res, req)

	// Assertions
	if res.Code != http.StatusNoContent {
		t.Errorf("Expected StatusOk, but got %#v\n", res.Code)
	}
}
