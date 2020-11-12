import csv
comp_list=["compatibility.csv","incompatibility.csv"]

# for filename in comp_list:
#     f = open(filename,'r',encoding='utf-8')
#     rdr = csv.reader(f)
#     i =1
#     for line in rdr:
#         print(line)
#         i+=1
#         if i ==5: 
#             break
#     f.close()
f = open('full_processed_incompatibility.txt','w',encoding='utf-8')
tf = open("incompatibility.csv",'r',encoding='utf-8')
rdr = csv.reader(tf)
i =1
for v in rdr: 
    
    if "," in v[2]:
       v[2] = v[2].replace(",","")

    f.write("('"+v[0]+"','"+v[1]+"','"+v[2]+"'),\n")


tf.close()