from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app
import os

class GsenegalPrez(webapp.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), './gsenegal-prez/index.html')
    param = {}
    self.response.out.write(template.render(path, param))

class GcotedivoirePrez(webapp.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), './gcotedivoire-prez/index.html')
    param = {}
    self.response.out.write(template.render(path, param))

class GmarocPrez(webapp.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), './gmaroc-prez/index.html')
    param = {}
    self.response.out.write(template.render(path, param))

class GAlgeriaExtendedHtml5(webapp.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), './galgeriaextended-html5/index.html')
    param = {}
    self.response.out.write(template.render(path, param))

class GAlgeriaExtendedApps(webapp.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), './galgeriaextended-apps/index.html')
    param = {}
    self.response.out.write(template.render(path, param))

class TunisiaTechWorkshop(webapp.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), './tunisiatech-workshop/index.html')
    param = {}
    self.response.out.write(template.render(path, param))

class DjembeDoodle(webapp.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), './djembe-doodle/index.html')
    param = {}
    self.response.out.write(template.render(path, param))

class Codelab(webapp.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), './codelab/index.html')
    param = {}
    self.response.out.write(template.render(path, param))

class GcotedivoireCodelab(webapp.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), './gcotedivoire-codelab/index.html')
    param = {}
    self.response.out.write(template.render(path, param))

class GmarocCodelab(webapp.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), './gmaroc-codelab/index.html')
    param = {}
    self.response.out.write(template.render(path, param))

class GmarocDoodle(webapp.RequestHandler):
  def get(self):
    path = os.path.join(os.path.dirname(__file__), './gmaroc-doodle/index.html')
    param = {}
    self.response.out.write(template.render(path, param))

application = webapp.WSGIApplication(
                                     [('/gsenegal-prez', GsenegalPrez),
                                     ('/gcotedivoire-prez', GcotedivoirePrez),
                                     ('/gmaroc-prez', GmarocPrez),
                                     ('/djembe-doodle', DjembeDoodle),
                                     ('/codelab', Codelab),
                                     ('/gcotedivoire-codelab', GcotedivoireCodelab),
                                     ('/gmaroc-codelab', GmarocCodelab),
                                     ('/gmaroc-doodle', GmarocDoodle),
                                     ('/galgeriaextended-html5', GAlgeriaExtendedHtml5),
                                     ('/galgeriaextended-apps', GAlgeriaExtendedApps),
                                     ('/tunisiatech-workshop', TunisiaTechWorkshop)],
                                     debug=True)

def main():
  run_wsgi_app(application)

if __name__ == "__main__":
  main()