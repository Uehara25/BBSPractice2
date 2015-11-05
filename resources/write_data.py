
import random

def generate_randstr():
	s = ""
	l = list(range(ord('a'), ord('a')+26))
	l += list(range(ord('A'), ord('A')+26))
	l += list(range(ord('0'), ord('0')+10))

	for x in range(100):
		s += chr(random.choice(l))
	return s


with open("data.txt", "w", encoding='utf-8') as file:
	for x in range(50):
		file.write("name" + str(x) + '\n');

		file.write(generate_randstr() + '\n')
