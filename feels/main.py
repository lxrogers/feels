import json
import os
import re
import logging

from google.appengine.api import app_identity
from google.appengine.api import channel
from google.appengine.api import users
from google.appengine.ext import ndb
import jinja2
import webapp2

CLOUD_PROJECT_ID = app_identity.get_application_id()
THE_TOKEN = channel.create_channel("bacon")
NUM_PARTICLES = 200;

def retrieveFeels(n):
	result = Feel.query().fetch(n);
	return result;

def formatFeels(feels):
	return [ {"color" : x.color, "reason" : x.reason} for x in feels ]

class Feel(ndb.Model):
	color = ndb.IntegerProperty()
	reason = ndb.StringProperty()
	date = ndb.DateTimeProperty(auto_now_add=True);

class FeelPage(webapp2.RequestHandler):
	def post(self):
		#store feel
		c = int(self.request.get('c'));
		r = self.request.get('r');
		feel = Feel(color=c, reason=r);
		feel.put();
		#forward the feel to rest of clientss
		message = {"color" : c, 'reason': r};
		channel.send_message(THE_TOKEN, json.dumps(message));

class OpenedPage(webapp2.RequestHandler):
	def post(self):
		logging.info("opened page")

class MainPage(webapp2.RequestHandler):

	def get(self):
		logging.info("MAIN PAGE")
		initial_message = {"name" : "bacon"};
		template_values = {
			'token': THE_TOKEN,
			'particle_data' : json.dumps(formatFeels(retrieveFeels(NUM_PARTICLES))),
			'initial_message': json.dumps(initial_message)
		}
		template = jinja_environment.get_template('index.html')
		self.response.out.write(template.render(template_values))
		return

jinja_environment = jinja2.Environment(
	loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), "")))

app = webapp2.WSGIApplication([
	('/', MainPage),
	('/opened', OpenedPage),
	('/feel', FeelPage)
], debug=True)