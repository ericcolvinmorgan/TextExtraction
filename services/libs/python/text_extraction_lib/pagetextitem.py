from enum import Enum

class PageTextItemHierarchy(Enum):
    PAGE = 1
    BLOCK = 2
    PARAGRAPH = 3
    LINE = 4
    WORD = 5
    CHARACTER = 6

class PageTextItem:
    def __init__(self, x:float , y:float, height:float, width:float, entry: str, hierarchy_level, confidence = -1):
        self._x = x
        self._y = y
        self._height = height
        self._width = width
        self._entry = entry
        self._hierarchy = hierarchy_level
        self._confidence = confidence
        self._sub_text_entries = []

    @property
    def x(self):
        return self._x

    @property
    def y(self):
        return self._y

    @property
    def height(self):
        return self._height
        
    @property
    def width(self):
        return self._width

    def to_json(self):
        return dict(x=self._x, y=self._y, height=self._height, width=self._width, entry=self._entry, hierarchy=self._hierarchy.name, confidence=self._confidence, sub_entries=self._sub_text_entries)

    def bounds(self, target):
        if(target.x >= self._x 
        and ((target.x + target.width) <= (self._x + self._width))
        and target.y >= self._y
        and ((target.y + target.height) <= (self._y + self._height))):
            return True

        return False

    def add_child(self, child):
        if(self.bounds(child)):
            #Determine if any current child bound target
            parents = [existing_item for existing_item in self._sub_text_entries if existing_item.bounds(child)]
            if(len(parents) > 0):
                parents[0].add_child(child)
            else:
                self._sub_text_entries.append(child)
    
    @staticmethod
    def tesseract_to_pagetext_hierarchy(tesseract_level):
        # Currently maps 1 to 1
        return PageTextItemHierarchy(tesseract_level)
