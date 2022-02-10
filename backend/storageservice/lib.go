package storageservice

import (
	"crypto/sha1"
	"fmt"
	"log"
	"os"
	"sort"
	"time"
)

type StorageItem struct {
	ContentType string
	LastUpdated time.Time
	Sha1        [20]byte
	Data        []byte
}

type StorageService struct {
	storage map[string]StorageItem
	logger  *log.Logger
}

func (s *StorageService) GetKeys() []string {
	s.logger.Println("Getting keys")
	keys := make([]string, len(s.storage))

	i := 0
	for k := range s.storage {
		keys[i] = k
		i++
	}
	sort.Strings(keys)
	return keys
}

func (s *StorageService) GetKey(keyName string) (*StorageItem, error) {
	s.logger.Printf("Getting key: %#v\n", keyName)
	if item, ok := s.storage[keyName]; ok {
		return &item, nil
	} else {
		return nil, fmt.Errorf("item not found")
	}
}

func (s *StorageService) SetKey(key_name string, key_value []byte, content_type string) *StorageItem {
	s.logger.Printf("Setting key: %#v\n", key_name)

	item := StorageItem{
		ContentType: content_type,
		LastUpdated: time.Now().UTC(),
		Sha1:        sha1.Sum(key_value),
		Data:        key_value,
	}

	s.storage[key_name] = item
	return &item
}

func (s *StorageService) DeleteKey(key_name string) {
	s.logger.Printf("Deleting key: %#v\n", key_name)
	delete(s.storage, key_name)
}

func NewItem(value []byte, contentType string) StorageItem {
	return StorageItem{
		ContentType: contentType,
		LastUpdated: time.Now().UTC(),
		Sha1:        sha1.Sum(value),
		Data:        value,
	}
}

func New() *StorageService {
	new_storage := &StorageService{
		storage: make(map[string]StorageItem),
		logger:  log.New(os.Stdout, "[storage] ", 0),
	}
	return new_storage
}
