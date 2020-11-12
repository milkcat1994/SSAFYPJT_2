package com.web.curation.controller.extraction;

import com.web.curation.util.MorphemeAnalyzer;

import org.python.core.PyFunction;
import org.python.core.PyObject;
import org.python.core.PyString;
import org.python.util.PythonInterpreter;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.ApiOperation;

@CrossOrigin(origins = { "*" }, maxAge = 6000)
@RestController
@RequestMapping("/test")

public class NounExtractionController {

    @GetMapping("py/{text}")
    @ApiOperation(value = "파이썬 konlpy 안됨...")
    public Object searchWordExtraction(@PathVariable String text) {
        PythonInterpreter pi = new PythonInterpreter();
        // pi.execfile("src/main/python/noun_extraction.py");
        pi.exec("from konlpy.tag import Twitter");
        pi.exec("import konlpy");
        pi.exec("print(noun_extract(" + text + "))");
        // pi.exec("print(noun_extract('사과카레라이스'))");

        PyFunction pf = (PyFunction) pi.get("noun_extract", PyFunction.class);
        PyObject pyobj = pf.__call__(new PyString(text));
        // PyObject pyobj = pf.__call__(new PyString("짬뽕밥"));
        System.out.println(pyobj.toString());

        pi.close();

        return pyobj.toString();
    }

    @GetMapping("/{text}")
    @ApiOperation("검색어 명사 추출: in - String, out - List<String>")
	public Object wordExtraction(@PathVariable String text) {
        
        MorphemeAnalyzer ma = new MorphemeAnalyzer();
        return ma.nounExtraction(text);

	}

}