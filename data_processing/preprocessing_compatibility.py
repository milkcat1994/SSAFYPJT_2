import csv

f = open('End_processed_new_compatibility.csv','w',encoding='utf-8')

tf = open("./processed_data/"+"compatibility.csv",'r',encoding='utf-8')
rdr = csv.reader(tf)
i = 420
for v in rdr:
#   f.write("('"+v[0]+"','"+v[1]+"','"+v[2]+"','"+v[3]+"','"+v[4]+"'),\n")
    f.write("('"+str(i)+"','"+v[0]+"','"+v[1]+"','"+v[2]+"','0'),\n")
    i+=1
    # if "," in v[2]:
    #    v[2] = v[2].replace(",","")

    # f.write("('"+v[0]+"','"+v[1]+"','"+v[2]+",0"'),\n")

tf.close()