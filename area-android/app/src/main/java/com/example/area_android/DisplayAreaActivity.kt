package com.example.area_android

import android.app.Activity
import android.app.AlertDialog
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.*
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.json.responseJson
import org.json.JSONObject
import com.github.kittinunf.result.Result

class DisplayAreaActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_display_area)

        val app = this.application as AreaApplication

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

        val modifyButton = findViewById<Button>(R.id.modifyButton)
        modifyButton.setOnClickListener {
            val intent = Intent(this, ModifyAreaActivity::class.java)
            intent.putExtra("area", area.toString())
            startActivityForResult(intent, 0)
        }

        val deleteButton = findViewById<Button>(R.id.deleteButton)
        deleteButton.setOnClickListener {
            Fuel.delete(app.serverUrl + "/me/area/" + area.getInt("id"))
                .authentication()
                .bearer(app.token!!)
                .responseJson { request, response, result ->
                    when (result) {
                        is Result.Success -> {
                            Toast.makeText(this, "Area deleted", Toast.LENGTH_SHORT).show()
                            setResult(Activity.RESULT_OK)
                            finish()
                        }
                        is Result.Failure -> {
                            Toast.makeText(this, "An error as occured", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (resultCode == Activity.RESULT_OK) {
            setResult(Activity.RESULT_OK)
            finish()
        }
    }
}
