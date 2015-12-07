from bs4 import BeautifulSoup as BS
import urllib.request
import json

def main():
	arjdesigns_game = Game('http://familyfeudfriends.arjdesigns.com/')
	
class Game():
	def __init__(self, url):
		self.questions = []
		self.url = url
		self.main_soup = self.get_soup_html(self.url)
		self.question_count = 0
		if self.main_soup == None:
			print("No data to process. Exiting.")
			return None
		self.main_links = self.main_soup.find_all('a')
		self.fill_questions()
		self.fill_answers()
		self.save_to_files()
		
	def fill_questions(self):
		for link in self.main_links:
			if '?Question' in link.get('href'):
				question_number = link.get('href').split('=')[1]
				question_url = self.url + link.get('href')
				question_text = link.text.replace('\u201c', '"').replace('\u201d', '"').replace('\u2019', "'")
				question = {
					'question_number': question_number,
					'question_text': question_text,
					'question_url': question_url,
					'answers': dict()
					}
				self.questions.append(question)
				self.question_count = self.question_count + 1
		print(str(self.question_count) + ' questions loaded from ' + self.url)
	
	def fill_answers(self):
		print("Filling answers with data.")
		for q_idx, question in enumerate(self.questions):
			answer_soup = self.get_soup_html(question['question_url'])
			table_data = answer_soup.find(id='DataGridQADetail').find_all('td')
			answer_count = 0
			for idx, td in enumerate(table_data):
				if 'class' not in td.attrs:
					if idx % 2 == 0:
						answer_count = answer_count + 1
						answer_text = td.text.strip()
						question['answers'][str(answer_count)] = dict()
						question['answers'][str(answer_count)]['answer_text'] = answer_text
					else:
						answer_points = td.text.strip()
						question['answers'][str(answer_count)]['answer_points'] = answer_points
			if q_idx % 20 == 0 or q_idx == self.question_count:
				percent_complete = 100 * (q_idx / self.question_count)
				print("{0:.2f}% complete.".format(percent_complete))
		print("Answers retrieved!")
						
	def save_to_files(self):
		print("Beginning output to files.")
		for idx, q in enumerate(self.questions):
			filename = str(q['question_number']) + '.json'
			with open(filename, 'w') as outfile:
				json.dump(q, outfile)
			if idx % 40 == 0 or idx == self.question_count:
				percent_complete = 100 * (idx / self.question_count)
				print("{0:.2f}% complete.".format(percent_complete))
		print("File Output complete!")
	
	def get_soup_html(self, url):
		result = None
	
		try:
			response = urllib.request.urlopen(url)
			result = BS(response.read())
		except urllib.error.URLError:
			print("Could not connect to " + url + "!")
			result = None
		finally:
			return result

if __name__ == "__main__": main()