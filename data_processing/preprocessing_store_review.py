import csv

SOURCE ="./processed_data/"
tf = open(SOURCE+"STORE_REVIEW.csv",'r',encoding='utf-8')
rdr = csv.reader(tf)

f = open('full_processed_store_review.txt','w',encoding='utf-8')
f.write("insert IGNORE into FOODMATE.STORE_REVIEW \n values\n")
for v in rdr: 
    if v[0]=="id":
        continue
    if "," in v[4]:
        v[4] = v[4].replace(",","")
    if "`" in v[4]:
        v[4] = v[4].replace("`","")
    if "\'" in v[4]:
        v[4] = v[4].replace("\'","")
    if v[5][:4]=="1970":
        v[5]="2018-01-01 18:00"
    if ";" in v[4]:
        v[4] = v[4].replace(";"," ")

    f.write("('"+v[0]+"','"+v[1]+"','"+v[2]+"','"+v[3]+"','"+v[4]+"','"+v[5]+"'),\n")

tf.close()
f.close()