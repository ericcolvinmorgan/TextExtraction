from text_extraction_lib.pagetextitem import PageTextItem, PageTextItemHierarchy 

class Page(object):

    def __init__(self, page_num:int, height:float, width:float, resolution_x:float, resolution_y:float, page_text: str):
        self._page_num = page_num
        self._resolution_x = resolution_x
        self._resolution_y = resolution_y
        self._page_text = PageTextItem(0, 0, height, width, page_text, PageTextItemHierarchy.PAGE)

    @property
    def page_num(self):
        return self._page_num

    @property
    def width(self):
        return self._page_text.width

    @property
    def height(self):
        return self._page_text.height

    @property
    def resolution_x(self):
        return self._resolution

    @property
    def resolution_y(self):
        return self._resolution

    def to_json(self):
        return dict(page_num=self._page_num, resolution_x=self._resolution_x, resolution_y=self._resolution_y, page_text=self._page_text)

    def add_text_entry(self, entry):
        self._page_text.add_child(entry)
