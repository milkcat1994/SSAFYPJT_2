package com.web.curation.util;

import java.util.LinkedList;
import java.util.List;

import kr.co.shineware.nlp.komoran.constant.DEFAULT_MODEL;
import kr.co.shineware.nlp.komoran.core.Komoran;
import kr.co.shineware.nlp.komoran.model.KomoranResult;
import kr.co.shineware.nlp.komoran.model.Token;

// 형태소 분석기
public class MorphemeAnalyzer {
    // 분리되지 않는 고유명사 리스트
    final String[] properNouns = {"김치", "전"};
    
    public List<String> nounExtraction (String text) {
        // 고유명사 분리
        text = extractProperNouns(text);

        // 형태소 분리, 모델 최대단위로
        Komoran komoran = new Komoran(DEFAULT_MODEL.FULL);
        String strToAnalyze = text;
        List<String> nouns = new LinkedList<String>();
    
        KomoranResult analyzeResultList = komoran.analyze(strToAnalyze);
    
        System.out.println(analyzeResultList.getPlainText());
    
        List<Token> tokenList = analyzeResultList.getTokenList();
        for (Token token : tokenList) {
            if (token.getPos().equals("NNP") || token.getPos().equals("NNG")) {
                System.out.println(token.getMorph());
                nouns.add(token.getMorph().toString());
            }
            if (token.getMorph().equals("무")) nouns.add("무");
            // System.out.format("(%2d, %2d) %s/%s\n", token.getBeginIndex(), token.getEndIndex(), token.getMorph(), token.getPos());
        }

        return nouns;
    }

    public String extractProperNouns(String text) {

        for (int i = 0; i < properNouns.length; i++) {
            // 고유 명사가 존재하면
            int startIdx = text.indexOf(properNouns[i]);
            if (startIdx >= 0) {
                text = text.substring(0, startIdx)
                        .concat("|")
                        .concat(text.substring(startIdx, startIdx + properNouns[i].length()))
                        .concat("|")
                        .concat(text.substring(startIdx + properNouns[i].length()));
            }
        }

        return text;
    }

}
