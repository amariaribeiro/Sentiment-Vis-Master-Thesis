import nltk
from collections import Counter

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

filename = "data/us_neut.csv"

sentences = []
exclude = ['jetblue', 'southwestair', 'united', 'americanair', 'usairways', 'virginamerica', 'http', 'your', 'with', 'that', 'just', 'this', 'service']

with open(filename, 'r', encoding="utf8") as f:
    lines = f.readlines()
    for line in lines:
        sentences.append(line)
words = []
for sentence in sentences:
    words += nltk.word_tokenize(sentence)

lower = [x.lower() for x in words]

tagged = nltk.pos_tag(lower)

adjectives = [word for word, tag in tagged if tag == 'JJ']

filtered = filter(lambda x: len(x) > 3 and x not in exclude, adjectives)

word_freq = Counter(filtered)
top_words = word_freq.most_common(20)  
print("Top words:", top_words)

file = open('data/us_neut.txt', 'w', encoding="utf-8")
file.write("word, count \n")

for x in top_words: 
    file.write(x[0] + ", " + str(x[1]) + "\n")    

file.close()