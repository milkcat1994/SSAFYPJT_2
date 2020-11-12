import pymysql

#필요한 기본 DB 정보
host = "j3a306.p.ssafy.io" #접속할 db의 host명
# host = "127.0.0.1" #접속할 db의 host명
port = 3306
user = "root" #접속할 db의 user명
pw = "mimi306" #접속할 db의 password
db = "FOODMATE" #접속할 db의 이름


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
    # 추천할 궁합의 메인 음식
    food = '삼겹살'
    # DB 연결
    curs, conn = sql_connection()
    # 쿼리
    sql = "SELECT * FROM FOODMATE.COMPATIBILITY WHERE FOOD_A='" + food + "' OR FOOD_B='" + food + "'"
    # 궁합 데이터
    comp_data = select_query_exec(curs, sql)

    # 궁합을 판매하는 식당
    for comp in comp_data:
        sql = "SELECT * FROM FOODMATE.STORE WHERE MENU LIKE '%" + comp[0] + "%' AND MENU LIKE '%" + comp[1] + "%'"
        res = select_query_exec(curs, sql)
        print("============" + comp[0] + ", " + comp[1] + "============")
        print(res)

    # db접속 종료
    close_db(curs, conn)


if __name__ == "__main__":
    main()
