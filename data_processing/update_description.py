import pymysql
import pandas as pd

#필요한 기본 DB 정보
host = "j3a306.p.ssafy.io" #접속할 db의 host명
# host = "127.0.0.1" #접속할 db의 host명
port = 3306
user = "root" #접속할 db의 user명
pw = "mimi306" #접속할 db의 password
db = "FOODMATE" #접속할 db의 이름

# 기존 데이터 경로
FILE_IN = "C:/workspace/PJT-workspace/PJT2-2/data_processing/processed_data/"

# 데이터 프레임에 담기
def to_dataframe(file_path):
    # 데이터 프레임
    file = pd.read_csv(file_path, delimiter=',', encoding='UTF-8')
    df = pd.DataFrame(data=file)
    return df


def sql_connection():
    #DB에 접속
    conn = pymysql.connect( host=host, port=port, user=user, password=pw, db=db)
    #sql문 실행을 위한 커서
    curs = conn.cursor()

    return curs, conn


def select_query_exec(curs, sql):
    # 쿼리 실행
    curs.execute(sql)
    #데이터 받아오기
    data = curs.fetchall()
    return data


def close_db(curs, conn):
    #db 접속 종료
    curs.close()
    conn.close()


def main():
    # DB 연결
    curs, conn = sql_connection()
    # 쿼리
    sql = "SELECT ID, FOOD_A, FOOD_B, length(DESCRIPTION) as len FROM FOODMATE.INCOMPATIBILITY where length(DESCRIPTION) >= 100"
    # 궁합 데이터
    comp_data = select_query_exec(curs, sql)

    for comp in comp_data:
        
        # 궁합
        print(comp[1] + ", " + comp[2])
        # 해당 궁합 description
        df = to_dataframe(FILE_IN + "incompatibility.csv")
        is_venezuela = df['food1'] == comp[1]
        # print(df[is_venezuela])
        df2 = df[is_venezuela]
        is_venezuela2 = df2['food2'] == comp[2]
        # print(df2[is_venezuela2])
        df3 = df2[is_venezuela2]
        description = df3['description'].values[0].strip()
        print(description)

        # 쿼리 실행
        sql = "UPDATE FOODMATE.INCOMPATIBILITY SET DESCRIPTION = '" + description + "' WHERE FOOD_A = '" + comp[1] + "' AND FOOD_B = '" + comp[2] + "'"
        curs.execute(sql)
        conn.commit()

    # db접속 종료
    close_db(curs, conn)


if __name__ == "__main__":
    main()
