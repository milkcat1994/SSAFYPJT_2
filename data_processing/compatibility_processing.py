# 궁합, 상극 데이터
import os    
import shutil
import pandas as pd

# 기존 데이터
FILE_IN = "./original_data/"
# 저장 목적지
DEST = "./processed_data/"

# txt파일 파싱
def parsing_data(org_path, res_path):
    fin = open(org_path, "r")
    fout = open(res_path, "w")
    fout.write("food1,food2,description\n")

    for line in fin:
        # 분할할 행 지정
        l = line.replace(', ', 'and')
        l = l.replace(',', 'and')
        l1 = l.replace(' ㆍ ', 'and')
        l1 = l1.replace('ㆍ', 'and')

        # 치환
        l2 = l1.replace('와 ', ',')
        l3 = l2.replace('과 ', ',')

        # 궁합 요리 일단 제외
        # 필요한 데이터 아니면 pass
        if l3.find(',') < 0 or l3.find('만남-') > 0 or l3.find('궁합') > 0:
            continue
        
        # 내용 설명 데이터
        l3 = l3.replace('; ', ',')
        l3 = l3.replace(';', ',')

        # 분할이 필요한 데이터
        if l3.find('and') > 0:
            # split
            l3_1 = l3.replace('and', ',')
            split_line = l3_1.split(',')
            
            # 행 분할
            for i in range(1, len(split_line)):
                sp = split_line[0] + ',' + split_line[i]
                if i < len(split_line) - 1:
                    sp = sp.strip() + '\n'
                # 분할한 행 쓰기
                fout.write(sp)

            continue
        
        fout.write(l3)
        

    fin.close()
    fout.close()


# txt파일 데이터 프레임에 담기
def to_dataframe(file_path):
    # 데이터 프레임
    file = pd.read_csv(file_path, delimiter=',', encoding='cp949')
    df = pd.DataFrame(data=file)
    return df


# 데이터 프레임 csv로 변환
def to_csv(df, dest_path):
    # 데이터 프레임
    # print(df.head())
    # csv로 변환
    df.to_csv(dest_path, encoding='cp949', index = False)


# 데이터 프레임 중복제거
# def merge_df(df):
    

def main():
    # 음식궁합
    # 파싱-궁합
    parsing_data(FILE_IN + "신재용의 음식궁합1-상극제거.txt", DEST + "신재용의 음식궁합1-파싱.txt")
    df1 = to_dataframe(DEST + "신재용의 음식궁합1-파싱.txt")
    # 파싱-궁합2
    parsing_data(FILE_IN + "신재용의 음식궁합2-상극제거.txt", DEST + "신재용의 음식궁합2-파싱.txt")
    df2 = to_dataframe(DEST + "신재용의 음식궁합2-파싱.txt")
    # 파싱-궁합3
    parsing_data(FILE_IN + "유태종의 음식궁합1-상극제거.txt", DEST + "유태종의 음식궁합1-파싱.txt")
    df3 = to_dataframe(DEST + "유태종의 음식궁합1-파싱.txt")

    # 데이터 병합
    df = pd.concat([df1, df2, df3], ignore_index=True)
    df = df.drop_duplicates().reset_index()
    to_csv(df[['food1', 'food2', 'description']], DEST + "음식궁합.csv")

    # 상극
    # 파싱
    parsing_data(FILE_IN + "음식상극.txt", DEST + "음식상극-파싱.txt")
    df = to_dataframe(DEST + "음식상극-파싱.txt")
    df = df.drop_duplicates().reset_index()
    to_csv(df[['food1', 'food2', 'description']], DEST + "음식상극.csv")



# columns: food, kcal, carbohydrate, protein, fat, cholesterol, dietary_fiber, salt

if __name__ == "__main__":
    main()