from enum import Enum
import json

class DocumentType(Enum):
    IMAGE = 1
    PDF = 2

class Document(object):

    def __init__(self, document_type):
        self._pages = []
        self._page_count = 0
        self._document_type = document_type
        
    def add_page(self, page):
        self._pages.append(page)
        self._page_count += 1

    def to_json(self):
        return dict(page_count=self._page_count, document_type=self._document_type.name, pages=self._pages)

class DocumentEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj,'to_json'):
            return obj.to_json()
        else:
            return json.JSONEncoder.default(self, obj)