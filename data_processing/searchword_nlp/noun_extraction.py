from konlpy.tag import Twitter


def noun_extract(search_word):
    nlpy = Twitter()
    words = search_word.strip()
    # 단일 검색어
    res_noun = nlpy.nouns(words)
    return res_noun


def main(search_word):
    nouns = noun_extract(search_word)
    print("=========== 명사 추출 ===========")
    print(nouns)
    return nouns


if __name__ == "__main__":
    main("김치볶음밥")