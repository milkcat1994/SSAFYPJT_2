# 궁합, 상극 데이터
import os    
import shutil
import pandas as pd

# 기존 데이터
FILE_IN = "./processed_data/"
# 저장 목적지
DEST = "./recommend/"



# 데이터 프레임에 담기
def to_dataframe(file_path):
    # 데이터 프레임
    file = pd.read_csv(file_path, delimiter=',', encoding='UTF-8')
    df = pd.DataFrame(data=file)
    return df


# 데이터 프레임 csv로 변환
def to_csv(df, dest_path):
    # 데이터 프레임
    # print(df.head())
    # csv로 변환
    df.to_csv(dest_path, encoding='cp949', index = True)

    

def main():
    df = to_dataframe(FILE_IN + "nutrient_data.csv")
    df = df.apply(pd.to_numeric, errors='coerce').fillna(0)
    print(df.dtypes)
    df.reset_index()
    # print(df)
    to_csv(df, DEST + "test.csv")



if __name__ == "__main__":
    main()