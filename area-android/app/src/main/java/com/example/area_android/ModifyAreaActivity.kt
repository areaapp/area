package com.example.area_android

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.ListView
import android.widget.TextView
import org.json.JSONObject

class ModifyAreaActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_modify_area)

        val intent = this.intent
        val area = JSONObject(intent.getStringExtra("area")!!)

        val areaName = findViewById<TextView>(R.id.areaName)
        val actionName = findViewById<TextView>(R.id.actionName)
        val reactionName = findViewById<TextView>(R.id.reactionName)
        val actionArgsList = findViewById<ListView>(R.id.actionArgsList)
        val reactionArgsList = findViewById<ListView>(R.id.reactionArgsList)

        areaName.text = area.getString("name")
        actionName.text = "Action: ${area.getJSONObject("action").getString("name")}"
        reactionName.text = "Reaction: ${area.getJSONObject("reaction").getString("name")}"

        val areaActionArgs = area.getJSONObject("action").getJSONObject("args")
        val actionIter: MutableIterator<String> = areaActionArgs.keys()
        val actionParamsName: MutableList<String> = ArrayList()
        while (actionIter.hasNext()) {
            val paramName = actionIter.next()
            actionParamsName.add("$paramName: ${areaActionArgs.getString(paramName)}")
        }
        actionArgsList.adapter = ArrayAdapter<String>(this,
            android.R.layout.simple_list_item_1,
            android.R.id.text1,
            actionParamsName)

        val areaReactionArgs = area.getJSONObject("reaction").getJSONObject("args")
        val reactionIter: MutableIterator<String> = areaReactionArgs.keys()
        val reactionParamsName: MutableList<String> = ArrayList()
        while (reactionIter.hasNext()) {
            val paramName = reactionIter.next()
            reactionParamsName.add("$paramName: ${areaReactionArgs.getString(paramName)}")
        }
        reactionArgsList.adapter = ArrayAdapter<String>(this,
            android.R.layout.simple_list_item_1,
            android.R.id.text1,
            reactionParamsName)
    }
}
