#tf = open('half_processed_STORE.txt','r',encoding='utf-8')
tf = open('half_processed_STORE.txt','r',encoding='utf-8')
values= tf.read()
values_list =values.split("\n")

i=1
f = open('full_processed_STORE.txt','w',encoding='utf-8')
for v in values_list:
    line = v.split(",")
    quote =v.split("'")
#    print(i," : ",len(quote)," : ",quote)
    if len(line)!=10 :
        continue
    if len(quote)!=19: # 
         continue
    if '\\' in v: # 역슬래시 \ 제거
        continue
    if ';' in v: # ; 제거
        continue
    f.write(v+"\n")

#    print(i," : ",len(quote)," : ",quote)
#    print(i," : ",v)
    i+=1

print(i,"rows inserted")

f.close()
tf.close()



