import json
from os import listdir
from os.path import isfile, join

def main():
	mypath = r'C:\Users\dan96211\Documents\Personal\Programming Stuff\Python\family feud\Feud Server\Feud Server\feud'
	
	#Get only files in the path, and only if they have a .json ending
	onlyjsonfiles = [ f for f in listdir(mypath) if isfile(join(mypath,f)) and f[-5:] == '.json' ]
	
	count_of_0 = 0
	count_of_1 = 0
	count_of_2 = 0
	count_of_3 = 0
	count_of_4 = 0
	count_of_5 = 0
	count_of_6 = 0
	count_of_7 = 0
	count_of_8 = 0
	count_of_9 = 0
	count_of_10 = 0
	
	anchor_tags = ""
	
	for filename in onlyjsonfiles:

		with open(join(mypath,filename), 'r') as infile:
			data = json.load(infile)
			print (data["question_number"] + ': ' 
				+ data["question_text"] + '\n' 
				+ str(len(data["answers"])) + ' answers\n\n')
			if len(data["answers"]) == 0:
				count_of_0 += 1
			if len(data["answers"]) == 1:
				count_of_1 += 1
			if len(data["answers"]) == 2:
				count_of_2 += 1
			if len(data["answers"]) == 3:
				count_of_3 += 1
			if len(data["answers"]) == 4:
				count_of_4 += 1
			if len(data["answers"]) == 5:
				count_of_5 += 1
			if len(data["answers"]) == 6:
				count_of_6 += 1
			if len(data["answers"]) == 7:
				count_of_7 += 1
			if len(data["answers"]) == 8:
				count_of_8 += 1
			if len(data["answers"]) == 9:
				count_of_9 += 1
			if len(data["answers"]) == 10:
				count_of_10 += 1
			anchor_tags = anchor_tags + "<span class='menu_item'>Question " + str(filename.split('.')[0]) + \
				": <a href='#' onclick='setQuestionFromMainMenu(this.id)' id='q" + \
				data["question_number"] + "'>" + data["question_text"] + \
				'</a> (' + str(len(data["answers"])) + ' answers)</span><br />\n'
	print(anchor_tags)
	print(str(count_of_0) + ' questions have 0 answers.')
	print(str(count_of_1) + ' questions have 1 answer.')
	print(str(count_of_2) + ' questions have 2 answers.')
	print(str(count_of_3) + ' questions have 3 answers.')
	print(str(count_of_4) + ' questions have 4 answers.')
	print(str(count_of_5) + ' questions have 5 answers.')
	print(str(count_of_6) + ' questions have 6 answers.')
	print(str(count_of_7) + ' questions have 7 answers.')
	print(str(count_of_8) + ' questions have 8 answers.')
	print(str(count_of_9) + ' questions have 9 answers.')
	print(str(count_of_10) + ' questions have 10 answers.')
	
	with open(join(mypath,"menu.html"), 'w') as outfile:
		outfile.write(anchor_tags)
main()